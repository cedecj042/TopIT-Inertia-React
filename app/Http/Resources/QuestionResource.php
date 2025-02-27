<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'question_id' => $this->question_id,
            'course_id' => $this->course_id,
            'question_detail_id' => $this->question_detail_id,
            'test_type' => $this->test_type,
            'question' => $this->question,
            'discrimination_index' => $this->discrimination_index,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y '), 
            'updated_at' => Carbon::parse(time: $this->updated_at)->format('F j, Y '), 
            'question_detail' => new QuestionDetailResource($this->whenLoaded('question_detail')), 
            'difficulty_type'=> $this->difficulty_type,
            'difficulty_value'=> $this->difficulty_value,
            'course' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}
