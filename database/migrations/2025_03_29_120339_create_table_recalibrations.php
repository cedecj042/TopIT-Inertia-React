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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recalibrations');
    }
};
