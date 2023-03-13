import type { Blockstore, Options, Pair } from 'interface-blockstore'
import type { CID } from 'multiformats/cid'
import type { AwaitIterable } from 'interface-store'

export class BaseBlockstore implements Blockstore {
  async has (key: CID, options?: Options): Promise<boolean> {
    return await Promise.reject(new Error('.has is not implemented'))
  }

  async put (key: CID, val: Uint8Array, options?: Options): Promise<void> {
    await Promise.reject(new Error('.put is not implemented'))
  }

  async * putMany (source: AwaitIterable<Pair>, options?: Options): AsyncIterable<Pair> {
    for await (const { cid, block } of source) {
      await this.put(cid, block, options)
      yield { cid, block }
    }
  }

  async get (key: CID, options?: Options): Promise<Uint8Array> {
    return await Promise.reject(new Error('.get is not implemented'))
  }

  async * getMany (source: AwaitIterable<CID>, options?: Options): AsyncIterable<Uint8Array> {
    for await (const key of source) {
      yield this.get(key, options)
    }
  }

  async delete (key: CID, options?: Options): Promise<void> {
    await Promise.reject(new Error('.delete is not implemented'))
  }

  async * deleteMany (source: AwaitIterable<CID>, options?: Options): AsyncIterable<CID> {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }

  /**
   * Extending classes should override `query` or implement this method
   */
  async * getAll (options?: Options): AwaitIterable<Pair> { // eslint-disable-line require-yield
    throw new Error('.getAll is not implemented')
  }
}
