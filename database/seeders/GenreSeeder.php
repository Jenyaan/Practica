<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Genre::create(["name" => "classic"]);
        Genre::create(["name" => "comedy"]);
        Genre::create(["name" => "crime"]);
    }
}
