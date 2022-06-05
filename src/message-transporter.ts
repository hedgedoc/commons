/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Decoder } from 'lib0/decoding'
import type { Encoder } from 'lib0/encoding'

import type { MessageType } from './messages/message-type.enum'

export type Handler = (encoder: Encoder, decoder: Decoder) => void

export type MessageTransporterEvents = {
  disconnected: () => void
  connected: () => void
  synced: () => void
} & Partial<Record<MessageType, Handler>>

export interface MessageTransporter {
  send(content: Uint8Array): void

  disconnect(): void

  on<E extends keyof MessageTransporterEvents>(
    event: E,
    listener: MessageTransporterEvents[E]
  ): void

  once<E extends keyof MessageTransporterEvents>(
    event: E,
    listener: MessageTransporterEvents[E]
  ): void
}
