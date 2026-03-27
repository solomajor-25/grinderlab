/**
 * Main-thread wrapper for the solver Web Worker.
 * Provides a clean async API for the UI to interact with the solver.
 */

import type {
  GameTreeConfig,
  SolverProgress,
  SolverResult,
  NodeQuery,
  NodeQueryResult,
  WorkerCommand,
  WorkerMessage,
  SolverAlgorithm,
  DCFRParams,
} from './types'

export class SolverWorker {
  private worker: Worker | null = null
  private progressCallback: ((progress: SolverProgress) => void) | null = null
  private solveResolve: ((result: SolverResult) => void) | null = null
  private solveReject: ((error: Error) => void) | null = null
  private queryResolve: ((result: NodeQueryResult) => void) | null = null
  private queryReject: ((error: Error) => void) | null = null

  constructor() {
    this.createWorker()
  }

  private createWorker() {
    this.worker = new Worker(
      new URL('./worker.ts', import.meta.url),
      { type: 'module' },
    )

    this.worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const msg = e.data

      switch (msg.type) {
        case 'progress':
          this.progressCallback?.(msg.data)
          break

        case 'complete':
          this.solveResolve?.(msg.data)
          this.solveResolve = null
          this.solveReject = null
          break

        case 'error':
          if (this.solveReject) {
            this.solveReject(new Error(msg.message))
            this.solveResolve = null
            this.solveReject = null
          } else if (this.queryReject) {
            this.queryReject(new Error(msg.message))
            this.queryResolve = null
            this.queryReject = null
          }
          break

        case 'queryResult':
          this.queryResolve?.(msg.data)
          this.queryResolve = null
          this.queryReject = null
          break
      }
    }

    this.worker.onerror = (e) => {
      const error = new Error(`Worker error: ${e.message}`)
      this.solveReject?.(error)
      this.queryReject?.(error)
    }
  }

  private send(cmd: WorkerCommand) {
    this.worker?.postMessage(cmd)
  }

  /**
   * Run the solver. Returns when solving is complete.
   */
  solve(
    config: GameTreeConfig,
    maxIterations: number = 1000,
    targetExploitability: number = 0.5,
    algorithm: SolverAlgorithm = 'cfr+',
    dcfrParams?: DCFRParams,
  ): Promise<SolverResult> {
    return new Promise((resolve, reject) => {
      this.solveResolve = resolve
      this.solveReject = reject
      this.send({ type: 'solve', config, maxIterations, targetExploitability, algorithm, dcfrParams })
    })
  }

  /**
   * Stop the current solve.
   */
  stop(): void {
    this.send({ type: 'stop' })
  }

  /**
   * Query a node's strategy from the solved tree.
   */
  queryNode(query: NodeQuery): Promise<NodeQueryResult> {
    return new Promise((resolve, reject) => {
      this.queryResolve = resolve
      this.queryReject = reject
      this.send({ type: 'query', query })
    })
  }

  /**
   * Set the progress callback.
   */
  onProgress(callback: (progress: SolverProgress) => void): void {
    this.progressCallback = callback
  }

  /**
   * Terminate the worker.
   */
  destroy(): void {
    this.worker?.terminate()
    this.worker = null
    this.progressCallback = null
    this.solveResolve = null
    this.solveReject = null
  }
}
