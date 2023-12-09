FROM mcr.microsoft.com/dotnet/aspnet:6.0.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build
WORKDIR /src

COPY ["BudgetAppAPI/BudgetAppAPI.csproj", "BudgetAppAPI/"]

RUN dotnet restore "BudgetAppAPI/BudgetAppAPI.csproj"
COPY . .

WORKDIR "/src/BudgetAppAPI"
RUN dotnet build "BudgetAppAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BudgetAppAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BudgetAppAPI.dll"]