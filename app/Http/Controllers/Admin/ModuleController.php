<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VectorRequest;
use App\Http\Resources\ModuleResource;
use App\Jobs\ProcessModule;
use App\Models\Course;
use App\Models\Content;
use App\Models\Module;
use App\Services\ModuleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ModuleController extends Controller
{
    protected $moduleService;

    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }

    public function index()
    {
        $modules = $this->moduleService->getFilteredModules(request());
        Log::info($modules['data']);
        return Inertia::render('Admin/Modules/Module', [
            'title' => 'Admin Module',
            'modules' => ModuleResource::collection($modules['data']),
            'filters' => $modules['filters'],
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(string $id)
    {
        $module = $this->moduleService->getModuleWithDetails($id);
        return Inertia::render('Admin/Modules/ModuleDetail', [
            'title' => 'Admin Module',
            'module' => new ModuleResource($module)
        ]);
    }

    public function edit(string $id)
    {
        $module = $this->moduleService->getModuleWithDetails($id);
        return Inertia::render('Admin/Modules/ModuleEdit', [
            'title' => 'Admin Module',
            'module' => new ModuleResource($module),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function update(Request $request, $contentableId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'contents' => 'nullable|array',
            'contents.*.content_id' => 'required_with:contents|exists:contents,content_id',
            'contents.*.order' => 'required_with:contents|integer',
            'contentable_type' => 'required|string|in:Module,Lesson,Section,Subsection',
        ]);

        $moduleId = $this->moduleService->updateContentable($validated, $contentableId);

        return redirect()->route('admin.module.edit', [
            'id' => $moduleId,
            'contentableId' => $contentableId,
            'contentableType' => $validated['contentable_type'],
        ])->with('success', 'Updated Successfully');
    }
    public function delete($id)
    {
        try {
            // Fetch the module using the given ID
            $module = Module::findOrFail($id);

            // Perform deletion of the module
            $module->delete();

            // Redirect back with success message
            return redirect()->route('admin.module.index')->with('success', 'Module deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Error deleting module: {$id}", ['error' => $e->getMessage()]);
            // Redirect back with error message if there's an exception
            return redirect()->back()->withErrors(['error' => 'Failed to delete the module.']);
        }
    }


    public function destroyContent($type, $id)
    {
        try {
            // Resolve the model class dynamically
            $modelClass = $this->moduleService->resolveModelClass(ucfirst($type));

            if (!$modelClass) {
                throw new \Exception('Invalid type specified.');
            }

            // Find and delete the model
            $model = $modelClass::findOrFail($id);
            $model->delete();

            return redirect()->back()->with('success', ucfirst($type) . ' deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Error deleting {$type}: ", ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to delete the content.']);
        }
    }


    public function courses()
    {
        return response()->json(['courses' => $this->moduleService->getCoursesWithModules()]);
    }

    public function vectorize(VectorRequest $request)
    {
        $validated = $request->validated();
        Log::info($validated);
        ProcessModule::dispatch($validated);
    }
}
