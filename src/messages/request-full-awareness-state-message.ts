/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { encoding } from 'lib0'
import { MessageType } from './message-type.enum'

export class RequestFullAwarenessStateMessage {
  public static encode(): Uint8Array {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, MessageType.REQUEST_FULL_AWARENESS_STATE)
    return encoding.toUint8Array(encoder)
  }
}
