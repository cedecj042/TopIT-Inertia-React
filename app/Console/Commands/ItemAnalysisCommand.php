<?php

namespace App\Console\Commands;

use App\Services\ItemAnalysisService;
use Illuminate\Console\Command;

class ItemAnalysisCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'item-analysis:run';

    protected ItemAnalysisService $itemAnalysisService;
    protected $description = 'Run item analysis and recalibrate question difficulty every 2 weeks';

    public function __construct(ItemAnalysisService $itemAnalysisService)
    {
        parent::__construct();
        $this->itemAnalysisService = $itemAnalysisService;
    }

    public function handle()
    {
        $this->info('Starting item analysis...');
        
        $this->itemAnalysisService->analyze();

        $this->info('Item analysis completed successfully.');
    }
}


