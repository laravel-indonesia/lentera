<?php namespace App\Core\Repository;

class EntityNotFoundException extends \Exception {

	/**
	 * Create new exception instance
	 *
	 * @param $id
	 * @param $table
	 */
	public function __construct($id, $table)
	{
		parent::__construct("Entity with identifier [$id] not found on table [$table]");
	}

}
