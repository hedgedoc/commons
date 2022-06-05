/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum MessageType {
  REQUEST_INITIAL_DOCUMENT_STATE,
  DOCUMENT_UPDATE,
  AWARENESS_UPDATE,
  REQUEST_FULL_AWARENESS_STATE,
  PING,
  PONG,
  HEDGEDOC
}
