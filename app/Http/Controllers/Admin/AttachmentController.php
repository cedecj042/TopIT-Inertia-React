<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttachmentRequest;
use App\Models\Attachment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AttachmentController extends Controller
{
    // AttachmentController.php

    protected function resolveModelClass($type)
    {
        $mapping = [
            'Module' => \App\Models\Module::class,
            'Lesson' => \App\Models\Lesson::class,
            'Section' => \App\Models\Section::class,
            'Subsection' => \App\Models\Subsection::class,
        ];

        return $mapping[$type] ?? null;
    }

    public function create(AttachmentRequest $request)
    {
        $validated = $request->validated();

        try {
            // Resolve the fully qualified model class from the base type
            $modelClass = $this->resolveModelClass($validated['attachmentable_type']);

            if (!$modelClass) {
                throw new Exception('Invalid attachmentable_type');
            }

            // Find the parent model instance based on attachmentable_id
            $parent = $modelClass::findOrFail($validated['attachmentable_id']);

            // Create the attachment and associate it with the parent
            $attachment = $parent->attachments()->create([
                'type' => $validated['type'],
                'description' => $validated['description'] ?? '',
                'caption' => $validated['caption'],
                'order' => $validated['order'],
                'file_name' => $validated['file_name'] ?? '',
                'file_path' => $validated['file_path'] ?? '',
            ]);

            Log::info('Attachment saved successfully:', ['attachment_id' => $attachment->attachment_id]);
            return redirect()->route('admin.module.edit', ['id' => $attachment->attachmentable_id])
                         ->with('success', 'Attachment created successfully!');
        } catch (Exception $e) {
            Log::error('Error saving attachment:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to save the attachment']);
        }
    }


    public function show(string $id)
    {
        //
    }
    public function update(AttachmentRequest $request, string $id)
    {
        try {
            $validated = $request->validated();
            $attachment = Attachment::findOrFail($id);
            $attachment->update($validated);

            Log::info('Attachment updated successfully:', ['attachment_id' => $attachment->attachment_id]);
            return back()->with('success', 'Attachment updated successfully!');
        } catch (Exception $e) {
            Log::error('Error saving attachment:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update the attachment']);
        }
    }

    public function destroy(int $id)
    {
        try {
            $attachment = Attachment::findOrFail($id);
            $attachment->delete();

            Log::info('Attachment deleted successfully:', ['attachment_id' => $attachment->attachment_id]);
            return back()->with('success', 'Attachment deleted successfully!');
        } catch (Exception $e) {
            Log::error('Error deleting attachment:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to delete the attachment']);
        }
    }
}
