<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\StudentResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userableResource = null;

        if ($this->userable_type === 'App\\Models\\Student') {
            $userableResource = new StudentResource($this->userable);
        } elseif ($this->userable_type === 'App\\Models\\Admin') {
            $userableResource = new AdminResource($this->userable);
        }

        return [
            'user_id' => $this->user_id,
            'userable_id' =>$this->userable_id,
            'userable_type'=>$this->userable_type,
            'userable' => $userableResource,
            'username' => $this->username,
            'email'=>$this->email,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
