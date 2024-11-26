<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'admin_id' =>$this->admin_id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'profile_image' => $this->profile_image,
            'last_login' => (new Carbon($this->last_login))->format('F d, Y h:i A'),
            'created_at' =>(new Carbon($this->created_at))->format('F d, Y'),
        ];
    }
}
