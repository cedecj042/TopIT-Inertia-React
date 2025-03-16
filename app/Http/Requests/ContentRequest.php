<?php

namespace App\Http\Requests;

use App\Enums\AttachmentType;
use App\Models\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->userable instanceof Admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'type' => 'required|string',
        'contentable_id' => 'required|string',
        'contentable_type' => 'required|string|in:Module,Lesson,Section,Subsection',
        'description' => 'nullable|string',
        'caption' => 'nullable|string|max:255',
        'order' => 'nullable|integer',
        'file_name' => 'nullable|string|max:255',
        'file_path' => 'nullable|string|max:255',
    ];
    }
}
