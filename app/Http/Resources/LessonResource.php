<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'lesson_id' =>$this->lesson_id,
            'title' => $this->title,
            'content' => $this->content,
            'created_at' => (new Carbon($this->created_at))->format('F d, Y'),
            'module' => new ModuleResource($this->whenLoaded('module')),
            'sections' => SectionResource::collection($this->whenLoaded('sections')),
            'contents' => ContentResource::collection($this->whenLoaded('contents'))
        ];
    }
}
