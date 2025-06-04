<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bookmark extends Model
{
    /**
     * Turn off updeted_at field
     */
    const UPDATED_AT = null;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = [];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
