<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PdfResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'course_id' =>$this->course_id,
            'title' => $this->title,
            'description' => $this->description,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'pdfs' => PdfResource::collection($this->whenLoaded('pdfs')),
            'questions' => QuestionResource::collection($this->whenLoaded('questions')),
        ];
    }
}
