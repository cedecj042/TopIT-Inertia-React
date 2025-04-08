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
        Schema::create('recalibrations', function (Blueprint $table) {
            $table->id('recalibration_id');
            $table->integer('total_question_logs');
            $table->enum('status', ['Pending', 'Failed', 'Success','Processing'])->default('Pending');
            $table->string('recalibrated_by');
            $table->integer('total_iterations')->nullable();
            $table->enum('convergence_status',['All','Some','None'])->nullable();
            $table->timestamps();
        });
        Schema::create('question_recalibration_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->foreignId('question_id')->references('question_id')->on('questions')->cascadeOnDelete();
            $table->foreignID('recalibration_id')->references('recalibration_id')->on('recalibrations')->cascadeOnDelete();
            $table->enum('previous_difficulty_type',['Very Easy','Easy','Average','Hard','Very Hard']);
            $table->enum('new_difficulty_type',['Very Easy','Easy','Average','Hard','Very Hard']);
            $table->float('previous_difficulty_value');
            $table->float('new_difficulty_value');
            $table->float('previous_discrimination_index');
            $table->float('new_discrimination_index');
            $table->float('standard_error_discrimination')->nullable();
            $table->float('standard_error_difficulty')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recalibrations');
        Schema::dropIfExists('question_recalibration_logs');
    }
};
