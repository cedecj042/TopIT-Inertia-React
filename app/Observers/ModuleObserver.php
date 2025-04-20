<?php

namespace App\Observers;

use App\Models\Module;
use App\Services\FastApiService;
use Log;

class ModuleObserver
{
    protected $fastAPIService;
    public function __construct(FastApiService $fastAPIService)
    {
        $this->fastAPIService = $fastAPIService;
    }

    public function deleted(Module $module)
    {
        if($module->vectorized){
            $response = $this->fastAPIService->deleteModule($module->module_uid);
            if ($response->successful()) {
                Log::info('FastAPI delete response: ' . $response->body());
            } else {
                Log::error('FastAPI delete request failed: ' . $response->body());
            }
        }
        
    }
}
