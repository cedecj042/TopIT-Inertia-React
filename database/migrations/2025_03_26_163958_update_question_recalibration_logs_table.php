<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('question_recalibration_logs', function (Blueprint $table) {
            $table->renameColumn('recalibration_log_id', 'log_id');
            // Add new columns
            $table->enum('previous_difficulty_type', ['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard'])->after('question_id');
            $table->enum('new_difficulty_type', ['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard'])->after('previous_difficulty_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('question_recalibration_logs', function (Blueprint $table) {
            $table->renameColumn('log_id', 'recalibration_log_id');
            $table->dropColumn(['previous_difficulty_type', 'new_difficulty_type']);
        });
    }
};
