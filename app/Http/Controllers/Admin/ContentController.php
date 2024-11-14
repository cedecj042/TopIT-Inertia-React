<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContentRequest;
use App\Models\Content;
use Exception;
use Illuminate\Support\Facades\Log;

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

    protected function getModuleId($contentableType, $contentableId)
    {
        if ($contentableType === 'Module') {
            return $contentableId;
        }
        
        $modelClass = $this->resolveModelClass($contentableType);
        if (!$modelClass) {
            throw new Exception('Invalid contentable_type');
        }

        $parentModel = $modelClass::findOrFail($contentableId);
        return $parentModel->module->module_id; // Assumes `module` relationship exists in each model
    }

    protected function redirectToModuleEdit($moduleId, $contentableId, $contentableType, $message)
    {
        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $contentableId,
            'contentableType' => $contentableType,
        ])->with('success', $message);
    }

    public function create(ContentRequest $request)
    {
        $validated = $request->validated();
        
        try {
            $modelClass = $this->resolveModelClass($validated['contentable_type']);
            if (!$modelClass) {
                throw new Exception('Invalid contentable_type');
            }

            $parent = $modelClass::findOrFail($validated['contentable_id']);
            $content = $parent->contents()->create([
                'type' => $validated['type'],
                'description' => $validated['description'] ?? '',
                'caption' => $validated['caption'],
                'order' => $validated['order'],
                'file_name' => $validated['file_name'] ?? '',
                'file_path' => $validated['file_path'] ?? '',
                'contentable_type' => $modelClass,
            ]);

            $moduleId = $this->getModuleId($validated['contentable_type'], $validated['contentable_id']);
            Log::info('Content saved successfully:', ['content_id' => $content->id]);

            return $this->redirectToModuleEdit($moduleId, $validated['contentable_id'], class_basename($modelClass), 'Content added successfully!');
        } catch (Exception $e) {
            Log::error('Error saving content:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to save the content']);
        }
    }

    public function update(ContentRequest $request, int $id)
    {
        try {
            $validated = $request->validated();

            $content = Content::findOrFail($id);
            $modelClass = $this->resolveModelClass(trim($validated['contentable_type']) ?? '');
            if (!$modelClass) {
                throw new Exception('Invalid contentable_type');
            }

            $content->update($validated);
            $moduleId = $this->getModuleId($validated['contentable_type'], $validated['contentable_id']);

            return $this->redirectToModuleEdit($moduleId, $validated['contentable_id'], class_basename($modelClass), 'Content updated successfully!');
        } catch (Exception $e) {
            Log::error('Error updating content:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update the content']);
        }
    }

    public function destroy(int $id)
    {
        try {
            $content = Content::findOrFail($id);
            Log::info('Content', $content->toArray());
            
            // Extract the base type from contentable_type
            $baseType = class_basename($content->contentable_type);
            $contentableId = $content->contentable_id;
            $moduleId = $this->getModuleId($baseType, $contentableId);

            $content->delete();
            Log::info('Content deleted successfully:', ['content_id' => $content->id]);

            return $this->redirectToModuleEdit($moduleId, $contentableId, $baseType, 'Content deleted successfully!');
        } catch (Exception $e) {
            Log::error('Error deleting content:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to delete the content']);
        }
    }
}
