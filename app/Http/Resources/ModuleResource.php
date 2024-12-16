<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'module_id' =>$this->module_id,
            'title' => $this->title,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'course' => new CourseResource($this->whenLoaded('course')),
            'lessons' => LessonResource::collection($this->whenLoaded('lessons')),
            'contents' => ContentResource::collection($this->whenLoaded('contents'))
        ];
    }
}
