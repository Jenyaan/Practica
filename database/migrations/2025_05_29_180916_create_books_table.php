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
        Schema::create("books", function (Blueprint $table) {
            $table->id();
            $table->string("title", 50);
            $table->string("author", 50);
            $table->string("description", 500)->nullable();
            $table->string("tags", 100)->nullable();
            $table->boolean("public")->default(true);
            $table->uuid("base_file_path");
            $table->foreignId("user_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });

        Schema::create("genres", function (Blueprint $table) {
            $table->id();
            $table->string("name", 20);
        });

        Schema::create("book_genre", function (Blueprint $table) {
            $table->id();
            $table->foreignId("book_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("genre_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create("formats", function (Blueprint $table) {
            $table->id();
            $table->string("name", 15);
        });

        Schema::create("book_format", function (Blueprint $table) {
            $table->id();
            $table->foreignId("book_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("format_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("formats");
        Schema::dropIfExists("book_format");
        Schema::dropIfExists("genres");
        Schema::dropIfExists("book_genre");
        Schema::dropIfExists("books");
    }
};
