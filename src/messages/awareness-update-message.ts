/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { decoding, encoding } from 'lib0'
import type { Decoder } from 'lib0/decoding'
import type { Awareness } from 'y-protocols/awareness'
import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate
} from 'y-protocols/awareness'

import { MessageType } from './message-type.enum'

export class AwarenessUpdateMessage {
  public static apply(decoder: Decoder, awareness: Awareness): void {
    applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), this)
  }

  public static encode(
    awareness: Awareness,
    updatedClientIds?: number[]
  ): Uint8Array {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, MessageType.AWARENESS_UPDATE)
    encoding.writeVarUint8Array(
      encoder,
      encodeAwarenessUpdate(
        awareness,
        updatedClientIds ?? [...awareness.getStates().keys()]
      )
    )
    return encoding.toUint8Array(encoder)
  }
}
