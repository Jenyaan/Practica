<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Format extends Model
{
    /**
     * The attributes that aren"t mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = [];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class);
    }
}
