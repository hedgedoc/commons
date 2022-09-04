/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MessageType } from './message-type.enum'
import { encodeGenericMessage } from './generic-message'

export function encodeCompleteAwarenessStateRequestMessage(): Uint8Array {
  return encodeGenericMessage(MessageType.COMPLETE_AWARENESS_STATE_REQUEST)
}
