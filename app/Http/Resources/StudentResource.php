<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'student_id' => $this->student_id,
            'firstname' =>$this->firstname,
            'lastname'=>$this->lastname,
            'profile_image' =>$this->profile_image,
            'birthdate' =>  (new Carbon($this->birthdate))->format('Y-m-d'),
            'gender'=> $this->gender,
            'address' => $this->address,
            'course' => $this->course,
            'school' => $this->school,
            'year' =>$this->year
        ];
    }
}
