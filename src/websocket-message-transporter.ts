/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { EventEmitter } from 'events'
import { decoding, encoding } from 'lib0'
import type TypedEmitter from 'typed-emitter'
import WebSocket from 'isomorphic-ws'

import type {
  MessageTransporter,
  MessageTransporterEvents
} from './message-transporter'
import { MessageType } from './messages/message-type.enum'

export abstract class WebsocketMessageTransporter
  extends (EventEmitter as new () => TypedEmitter<MessageTransporterEvents>)
  implements MessageTransporter
{
  private websocket: WebSocket | undefined
  protected synced = false

  protected constructor() {
    super()
  }

  protected setupSocket(websocket: WebSocket): void {
    this.websocket = websocket
    websocket.binaryType = 'arraybuffer'
    websocket.addEventListener('message', this.decodeMessage.bind(this))
    websocket.addEventListener('error', () => websocket.close())
    websocket.addEventListener('open', () => this.emit('connected'))
    websocket.addEventListener('close', () => {
      if (this.synced) {
        this.synced = false
        this.emit('disconnected')
      }
    })
  }

  private decodeMessage(event: WebSocket.MessageEvent): void {
    const data = new Uint8Array(event.data as ArrayBuffer)
    const decoder = new decoding.Decoder(data)
    const encoder = new encoding.Encoder()
    const messageType = decoding.readVarUint(decoder) as MessageType
    if (messageType === MessageType.DOCUMENT_UPDATE && !this.synced) {
      this.synced = true
      this.emit('synced')
    }
    this.emit(messageType, encoder, decoder)
  }

  /**
   * Sends binary data to the client. Closes the connection on errors.
   *
   * @param content The binary data to send.
   */
  public send(content: Uint8Array): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      return
    }

    try {
      this.websocket.send(content)
    } catch (error: unknown) {
      this.websocket.close()
    }
  }

  public disconnect(): void {
    this.websocket?.close()
  }
}
