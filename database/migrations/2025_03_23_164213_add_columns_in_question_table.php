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
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['question_detail_id']); 
            $table->dropColumn('question_detail_id');
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');

            // Add new fields
            $table->enum('question_type', ['Identification', 'Multiple Choice - Single', 'Multiple Choice - Many']);
            $table->json('answer');
            $table->json('choices')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->unsignedBigInteger('question_detail_id')->nullable();
            $table->foreign('question_detail_id')->references('question_detail_id')->on('question_details')->onDelete('cascade');
            $table->dropColumn(['question_type', 'answer', 'choices', 'requires_all_answer']);
        });
    }
};
