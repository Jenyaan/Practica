<?php

namespace App\Rules;

use App\Models\Genre;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ExistGenreRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!Genre::all("id")->contains($value)) {
            $fail("Genre with id = $value does't exist. Select correct id.");
        }
    }
}
