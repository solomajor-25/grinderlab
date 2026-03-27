/**
 * Solver Web Worker entry point.
 * Runs CFR+ algorithm in a background thread to keep the UI responsive.
 */

import type { WorkerCommand, WorkerMessage, GameTreeData, SolverProgress } from './types'
import { DEFAULT_DCFR_PARAMS } from './types'
import { buildGameTree } from './game-tree'
import { solve } from './cfr'
import { queryNode } from './strategy'

let tree: GameTreeData | null = null
let stopFlag = false

function postMsg(msg: WorkerMessage) {
  self.postMessage(msg)
}

self.onmessage = (e: MessageEvent<WorkerCommand>) => {
  const cmd = e.data

  switch (cmd.type) {
    case 'solve': {
      stopFlag = false

      try {
        // Build the game tree
        tree = buildGameTree(cmd.config)

        const exploitabilityHistory: number[] = []

        const algorithm = cmd.algorithm ?? 'cfr+'
        const dcfrParams = cmd.dcfrParams ?? DEFAULT_DCFR_PARAMS

        // Run the solver
        const result = solve(
          tree,
          cmd.maxIterations,
          cmd.targetExploitability,
          (progress) => {
            exploitabilityHistory.push(progress.exploitabilityPct)
            const elapsed = progress.elapsed

            const progressMsg: SolverProgress = {
              iteration: progress.iteration,
              totalIterations: cmd.maxIterations,
              exploitability: progress.exploitability,
              exploitabilityPct: progress.exploitabilityPct,
              elapsed,
              nodesPerSecond: tree ? (progress.iteration * tree.nodes.length * 2) / (elapsed / 1000) : 0,
              exploitabilityHistory: [...exploitabilityHistory],
            }

            postMsg({ type: 'progress', data: progressMsg })
          },
          () => stopFlag,
          algorithm,
          dcfrParams,
        )

        postMsg({
          type: 'complete',
          data: {
            converged: result.exploitabilityPct <= cmd.targetExploitability,
            iterations: result.iterations,
            exploitability: result.exploitability,
            exploitabilityPct: result.exploitabilityPct,
            elapsed: result.elapsed,
          },
        })
      } catch (err) {
        postMsg({ type: 'error', message: String(err) })
      }
      break
    }

    case 'stop': {
      stopFlag = true
      break
    }

    case 'query': {
      if (!tree) {
        postMsg({ type: 'error', message: 'No solved tree available. Run a solve first.' })
        return
      }

      try {
        const result = queryNode(tree, cmd.query)
        postMsg({ type: 'queryResult', data: result })
      } catch (err) {
        postMsg({ type: 'error', message: `Query failed: ${err}` })
      }
      break
    }
  }
}
