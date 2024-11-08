<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContentRequest;
use App\Models\Content;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ContentController extends Controller
{
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

    public function create(ContentRequest $request)
    {
        $validated = $request->validated();
        try {
            // Resolve the fully qualified model class from the base type
            $modelClass = $this->resolveModelClass($validated['contentable_type']);

            if (!$modelClass) {
                throw new Exception('Invalid contentable_type');
            }

            // Find the parent model instance based on contentable_id
            $parent = $modelClass::findOrFail($validated['contentable_id']);

            // Create the content and associate it with the parent
            $content = $parent->contents()->create([
                'type' => $validated['type'],
                'description' => $validated['description'] ?? '',
                'caption' => $validated['caption'],
                'order' => $validated['order'],
                'file_name' => $validated['file_name'] ?? '',
                'file_path' => $validated['file_path'] ?? '',
                'contentable_type' => $modelClass, // Store the fully qualified class name
            ]);

            Log::info('Content saved successfully:', ['content_id' => $content->id]);
            return redirect()->back()->with('success', 'Content Added Successfully');
        } catch (Exception $e) {
            Log::error('Error saving content:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to save the content']);
        }
    }

    public function update(ContentRequest $request, int $id)
    {
        try {
            Log::info($request);
            $validated = $request->validated();

            // Find the content to update
            $content = Content::findOrFail($id);

            // Resolve the fully qualified model class from the base type for contentable_type
            $modelClass = $this->resolveModelClass($validated['contentable_type'] ?? '');

            if (!$modelClass) {
                throw new Exception('Invalid contentable_type');
            }

            // Update the content data
            $validated['contentable_type'] = $modelClass; // Use the fully qualified class name
            $content->update($validated);

            Log::info('Content updated successfully:', ['content_id' => $content->content_id]);
            return redirect()->back()->with('success', 'Content updated successfully!');
        } catch (Exception $e) {
            Log::error('Error updating content:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update the content']);
        }
    }

    public function destroy(int $id)
    {
        try {
            $content = Content::findOrFail($id);
            $content->delete();

            Log::info('Content deleted successfully:', ['content_id' => $content->id]);
            return redirect()->back()->with('success', 'Content deleted successfully!');
        } catch (Exception $e) {
            Log::error('Error deleting content:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to delete the content']);
        }
    }

    
}
