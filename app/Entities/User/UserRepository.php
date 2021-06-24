<?php namespace App\Entities\User;

use App\Core\Repository\EloquentRepository;

class UserRepository extends EloquentRepository {

	/**
	 * The model to execute queries on.
	 *
	 * @var \App\Entities\User\User $model
	 */
	protected $model;

	/**
	 * Create new repository instance.
	 *
	 * @param \App\Entities\User\User $model
	 */
	public function __construct(User $model)
	{
		parent::__construct($model);
	}

}
