/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Doc } from 'yjs'
import { encodeStateAsUpdate } from 'yjs'

import { MessageType } from './message-type.enum'
import { createEncoder, toUint8Array, writeVarUint, writeVarUint8Array } from 'lib0/encoding'
import { Decoder } from 'lib0/decoding'
import { decoding } from 'lib0'

export function encodeCompleteDocumentStateAnswerMessage(doc: Doc, decoder: Decoder): Uint8Array {
  const encoder = createEncoder()
  writeVarUint(encoder, MessageType.COMPLETE_DOCUMENT_STATE_ANSWER)
  writeVarUint8Array(encoder, encodeStateAsUpdate(doc, decoding.readVarUint8Array(decoder)))
  return toUint8Array(encoder)
}
