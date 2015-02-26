<?php namespace App\Core\Repository;

use Illuminate\Database\Eloquent\Model;

abstract class EloquentRepository  {

	/**
	 * The model to execute queries on.
	 *
	 * @var \Illuminate\Database\Eloquent\Model
	 */
	protected $model;

	/**
	 * Create a new repository instance.
	 *
	 * @param Model $model
	 */
	public function __construct(Model $model)
	{
		$this->model = $model;
	}

	/**
	 * Get a new instance of the model.
	 *
	 * @param  array $attributes
	 *
	 * @return \Illuminate\Database\Eloquent\Model
	 */
	public function getNew(array $attributes = [])
	{
		return $this->model->newInstance($attributes);
	}

}
