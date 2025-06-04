<?php

namespace Database\Seeders;

use App\Models\Format;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormatSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Format::create(["name" => "pdf"]);
        Format::create(["name" => "doc"]);
        Format::create(["name" => "docx"]);
        Format::create(["name" => "txt"]);
        Format::create(["name" => "epub"]);
        Format::create(["name" => "rtf"]);
        Format::create(["name" => "odt"]);
        Format::create(["name" => "djvu"]);
        Format::create(["name" => "djv"]);
        Format::create(["name" => "fb2"]);
    }
}
