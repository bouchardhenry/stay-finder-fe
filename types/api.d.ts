/** Felformatet som backend alltid svarar med. */
export type ApiErrorBody = {
  message: string;
  code?: string;
  /** Fältnamn -> felmeddelande, så formulär kan visa felet vid rätt fält. */
  errors?: Record<string, string>;
};

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: ApiErrorBody };
