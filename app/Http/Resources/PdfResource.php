<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PdfResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'pdf_id' => $this->pdf_id,
            'file_name' => $this->file_name,
            'status' => $this->status,
            'uploaded_by' => $this->uploaded_by
        ];
    }
}