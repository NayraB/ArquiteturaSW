namespace JogosDeGuerraModel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _2911v2 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Exercitoes", "BatalhaId");
            AddForeignKey("dbo.Exercitoes", "BatalhaId", "dbo.Batalhas", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Exercitoes", "BatalhaId", "dbo.Batalhas");
            DropIndex("dbo.Exercitoes", new[] { "BatalhaId" });
        }
    }
}
