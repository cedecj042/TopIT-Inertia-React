<?php

namespace App\Http\Resources;

use Carbon\Carbon;
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
            'uploaded_by' => $this->uploaded_by,
            'created_at'=>(new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at'=>(new Carbon($this->updated_at))->format('Y-m-d'),
            'course' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}