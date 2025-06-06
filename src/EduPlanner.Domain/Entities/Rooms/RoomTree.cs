﻿using System.ComponentModel.DataAnnotations.Schema;
using EduPlanner.Domain.Interfaces;

namespace EduPlanner.Domain.Entities.Rooms;

[Table("room_tree")]
public class RoomTree: IEntity
{
    [Column("id_room_tree")]
    public int Id { get; set; }
    [Column("name")]
    public string? Name { get; set; }
    [Column("parent")]
    public int? ParentId { get; set; }
    [Column("bShowPlan")]
    public bool? ShowPlan { get; set; }
    
}