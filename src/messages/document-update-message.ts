/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { decoding, encoding } from 'lib0'
import type { Decoder } from 'lib0/decoding'
import type { Doc } from 'yjs'
import { applyUpdate, encodeStateAsUpdate } from 'yjs'

import { MessageType } from './message-type.enum'

export class DocumentUpdateMessage {
  public static apply(decoder: Decoder, doc: Doc): void {
    try {
      applyUpdate(doc, decoding.readVarUint8Array(decoder), this)
    } catch (error) {
      // This catches errors that are thrown by event handlers
      console.error('Caught error while handling a Yjs update', error)
    }
  }

  public static encode(doc: Doc, update: Uint8Array): Uint8Array {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, MessageType.DOCUMENT_UPDATE)
    encoding.writeVarUint8Array(encoder, encodeStateAsUpdate(doc, update))
    return encoding.toUint8Array(encoder)
  }
}
