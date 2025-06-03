<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublicBookRequest extends FormRequest
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
            "page" => "numeric|integer",
            "per_page" => "numeric|integer|max:999",
            "filter_by" => "array",
            // "filter_by.*"=>[Rule::in(["title", "author", "tags", "year"])],
            "filter_by.*" => "starts_with:title:,author:,tags:,year:",
            "sort_by" => [Rule::in(["title", "author", "tags", "year"])],
            "order_by" => [Rule::in(["desc", "asc"])],
        ];
    }
}
