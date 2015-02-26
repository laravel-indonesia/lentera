<?php namespace App\Entities\Group;

use App\Core\Repository\EloquentRepository;

class GroupRepository extends EloquentRepository {

	/**
	 * The model to execute queries on.
	 *
	 * @var \App\Entities\Group\Group $model
	 */
	protected $model;

	/**
	 * Create new repository instance.
	 *
	 * @param \App\Entities\Group\Group $model
	 */
	public function __construct(Group $model)
	{
		parent::__construct($model);
	}

}
