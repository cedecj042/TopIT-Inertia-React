<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContentRequest;
use App\Services\ContentService;
use Illuminate\Support\Facades\Log;

class ContentController extends Controller
{
    protected $contentService;

    public function __construct(ContentService $contentService)
    {
        $this->contentService = $contentService;
    }

    public function create(ContentRequest $request)
    {
        $validated = $request->validated();

        try {
            $content = $this->contentService->createContent($validated);

            return $this->redirectToModuleEdit(
                $content['moduleId'], 
                $validated['contentable_id'], 
                $validated['contentable_type'], 
                'Content added successfully!'
            );
        } catch (\Exception $e) {
            return $this->handleError('saving', $e);
        }
    }

    public function update(ContentRequest $request, int $id)
    {
        $validated = $request->validated();

        try {
            $content = $this->contentService->updateContent($id, $validated);

            return $this->redirectToModuleEdit(
                $content['moduleId'], 
                $validated['contentable_id'], 
                $validated['contentable_type'], 
                'Content updated successfully!'
            );
        } catch (\Exception $e) {
            return $this->handleError('updating', $e);
        }
    }

    public function destroy(int $id)
    {
        try {
            $content = $this->contentService->deleteContent($id);

            return $this->redirectToModuleEdit(
                $content['moduleId'], 
                $content['contentableId'], 
                $content['baseType'], 
                'Content deleted successfully!'
            );
        } catch (\Exception $e) {
            return $this->handleError('deleting', $e);
        }
    }

    // Helper to redirect to the module edit page
    private function redirectToModuleEdit($moduleId, $contentableId, $contentableType, $message)
    {
        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $contentableId,
            'contentableType' => $contentableType,
        ])->with('success', $message);
    }

    // Helper to handle errors
    private function handleError($action, $exception)
    {
        Log::error("Error {$action} content: ", ['exception' => $exception->getMessage()]);
        return back()->withErrors(['error' => "Failed to {$action} the content"]);
    }
}
