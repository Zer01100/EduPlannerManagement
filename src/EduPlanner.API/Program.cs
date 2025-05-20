using EduPlanner.API.Endpoints;
using EduPlanner.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
var apiGroup = app.MapGroup("api");
apiGroup.MapGroups();
apiGroup.MapRooms();
apiGroup.MapTeachers();
apiGroup.MapColors();
apiGroup.MapWeeks();
apiGroup.MapWeekTypes();

//app.UseHttpsRedirection();



app.Run();