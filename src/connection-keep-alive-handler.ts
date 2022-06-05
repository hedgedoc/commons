/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { encoding } from 'lib0'
import { clearInterval } from 'timers'

import type { MessageTransporter } from './message-transporter'
import { MessageType } from './messages/message-type.enum'

/**
 * Provides a keep alive ping for a given {@link WebSocket websocket} connection by sending a periodic message.
 */
export class ConnectionKeepAliveHandler {
  private pongReceived = false
  private static readonly pingTimeout = 30 * 1000
  private intervalId: NodeJS.Timer | undefined

  /**
   * Constructs the instance and starts the interval.
   *
   * @param messageTransporter The websocket to keep alive
   */
  constructor(private messageTransporter: MessageTransporter) {}

  /**
   * Starts the ping timer.
   */
  public startTimer(): void {
    this.pongReceived = false
    this.intervalId = setInterval(
      () => this.check(),
      ConnectionKeepAliveHandler.pingTimeout
    )
    this.messageTransporter.on('disconnected', () => this.stopTimer())
    this.messageTransporter.on('connected', () => this.startTimer())
    this.messageTransporter.on(MessageType.PING, () => this.sendPongMessage())
    this.messageTransporter.on(
      MessageType.PONG,
      () => (this.pongReceived = true)
    )
  }

  public stopTimer(): void {
    clearInterval(this.intervalId)
  }

  /**
   * Checks if a pong has been received since the last run. If not, the connection is probably dead and will be terminated.
   */
  private check(): void {
    if (this.pongReceived) {
      this.pongReceived = false
      try {
        this.sendPingMessage()
      } catch (e) {
        this.messageTransporter.disconnect()
        console.error(`Couldn't send ping`)
      }
    } else {
      this.messageTransporter.disconnect()
      console.error(
        `No pong received in the last ${ConnectionKeepAliveHandler.pingTimeout} seconds. Connection seems to be dead.`
      )
    }
  }

  private sendPingMessage(): void {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, MessageType.PING)
    this.messageTransporter.send(encoding.toUint8Array(encoder))
  }

  private sendPongMessage(): void {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, MessageType.PONG)
    this.messageTransporter.send(encoding.toUint8Array(encoder))
  }
}
