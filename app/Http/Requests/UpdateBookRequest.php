<?php

namespace App\Http\Requests;

use App\Rules\ExistGenreRule;
use App\Rules\UniqueFileFormatRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => "string|min:10|max:50",
            "author" => "string|max:50",
            "description" => "string|max:500",
            "tags" => "string|max:100",
            "genres" => "array|min:1",
            "genres.*" => ["numeric", "integer", new ExistGenreRule],
            "formats" => "nullable|array",
            "formats.*" => "nullable|exists:formats,name",
            "files" => ["array", "min:1", "max:10", new UniqueFileFormatRule],
            "files.*" => File::types(["pdf", "doc", "docx", "txt", "epub", "rtf", "odt", "djvu", "djv", "fb2"])->max("500mb"),
            "public" => "boolean",
        ];
    }
}
