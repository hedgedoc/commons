/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { encoding } from 'lib0'
import type { Doc } from 'yjs'
import { encodeStateVector } from 'yjs'

import { MessageType } from './message-type.enum'

export class RequestInitialDocumentStateMessage {
  public static encode(doc: Doc): Uint8Array {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, MessageType.REQUEST_INITIAL_DOCUMENT_STATE)
    encoding.writeVarUint8Array(encoder, encodeStateVector(doc))
    return encoding.toUint8Array(encoder)
  }
}
