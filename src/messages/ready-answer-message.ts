/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MessageType } from './message-type.enum'
import { createEncoder, toUint8Array, writeVarUint } from 'lib0/encoding'

export function encodeReadyAnswerMessage(): Uint8Array {
  const encoder = createEncoder()
  writeVarUint(encoder, MessageType.READY_ANSWER)
  return toUint8Array(encoder)
}
