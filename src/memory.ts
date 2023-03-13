import { BaseBlockstore } from './base.js'
import { base32 } from 'multiformats/bases/base32'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'
import * as Digest from 'multiformats/hashes/digest'
import * as Errors from './errors.js'
import type { AwaitIterable } from 'interface-store'
import type { Pair } from 'interface-blockstore'

export class MemoryBlockstore extends BaseBlockstore {
  private readonly data: Map<string, Uint8Array>

  constructor () {
    super()

    this.data = new Map()
  }

  async put (key: CID, val: Uint8Array): Promise<void> { // eslint-disable-line require-await
    this.data.set(base32.encode(key.multihash.bytes), val)
  }

  async get (key: CID): Promise<Uint8Array> {
    const buf = this.data.get(base32.encode(key.multihash.bytes))

    if (buf == null) {
      throw Errors.notFoundError()
    }

    return buf
  }

  async has (key: CID): Promise<boolean> {
    return this.data.has(base32.encode(key.multihash.bytes))
  }

  async delete (key: CID): Promise<void> {
    this.data.delete(base32.encode(key.multihash.bytes))
  }

  async * getAll (): AwaitIterable<Pair> {
    for (const [key, value] of this.data.entries()) {
      yield {
        cid: CID.createV1(raw.code, Digest.decode(base32.decode(key))),
        block: value
      }
    }
  }
}
